import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.products.repository import ProductRepository
from app.products.models import Product
from app.services.metadata_normalizer import MetadataNormalizer

class RichProduct(BaseModel):
    id: int
    slug: str
    title: str
    description: str
    category: str
    collection: Optional[str] = None
    brand: str
    style_tags: List[str]
    occasion: str
    season: str
    gender: str
    fit: str
    material: str
    colours: List[str]
    available_sizes: List[str]
    stock: int
    price: float
    product_url: str
    related_products: List[int]

    # ─── New Intelligence Fields ───
    silhouette: str = "Regular Fit"
    garment_type: str = "Innerwear"
    primary_style: str = "Streetwear"
    compatible_styles: List[str] = Field(default_factory=list)
    layering_role: str = "base_layer"
    seasonality: List[str] = Field(default_factory=list)
    formality_index: int = 5
    material_blend: str = ""
    color_palette: List[str] = Field(default_factory=list)
    recommended_pairings: List[int] = Field(default_factory=list)

class CatalogService:
    _product_cache = {}
    _all_products_cache = None
    _search_cache = {}

    def __init__(self, repository: Optional[ProductRepository] = None):
        self.repository = repository or ProductRepository()

    def get_garment_type(self, category: str) -> str:
        cat = category.lower()
        if "jacket" in cat or "coat" in cat:
            return "Outerwear"
        if "shoe" in cat or "boot" in cat:
            return "Footwear"
        if "pants" in cat or "chinos" in cat or "jeans" in cat:
            return "Bottom"
        return "Innerwear"

    def get_layering_role(self, category: str) -> str:
        cat = category.lower()
        if "jacket" in cat or "coat" in cat:
            return "shell"
        if "hoodie" in cat or "sweater" in cat or "knit" in cat:
            return "mid_layer"
        return "base_layer"

    def map_to_rich_product(self, p: Product, all_products: List[Product]) -> RichProduct:
        # Resolve related products in the same category (limit to 4, excluding current product)
        related_ids = [
            other.id for other in all_products
            if other.category == p.category and other.id != p.id
        ][:4]

        # Normalize colours
        colours_list = MetadataNormalizer.normalize_colours(p.color)

        slug = re.sub(r'[^a-z0-9\-]', '', p.name.lower().replace(" ", "-"))

        fit_val = MetadataNormalizer.normalize_fit(p.name, p.description)
        mat_val = MetadataNormalizer.normalize_material(p.name, p.description)
        occ_val = MetadataNormalizer.normalize_occasion(p.category, p.style_tags)
        g_type = self.get_garment_type(p.category)
        l_role = self.get_layering_role(p.category)
        p_style = p.style_tags[0] if p.style_tags else "Streetwear"

        return RichProduct(
            id=p.id,
            slug=slug,
            title=p.name,
            description=p.description,
            category=p.category,
            collection=p.collection_name,
            brand=p.brand,
            style_tags=p.style_tags,
            occasion=occ_val,
            season=p.season,
            gender=p.gender,
            fit=fit_val,
            material=mat_val,
            colours=colours_list if colours_list else [p.color],
            available_sizes=p.size_options,
            stock=p.stock_quantity,
            price=p.price,
            product_url=f"/product/{p.id}",
            related_products=related_ids,

            # Derived intelligence fields
            silhouette=fit_val,
            garment_type=g_type,
            primary_style=p_style,
            compatible_styles=p.style_tags,
            layering_role=l_role,
            seasonality=[p.season],
            formality_index=7 if "Resort" in occ_val or "Formal" in occ_val else 4,
            material_blend=mat_val,
            color_palette=colours_list if colours_list else [p.color],
            recommended_pairings=related_ids
        )

    def get_product_by_id(self, product_id: int) -> Optional[RichProduct]:
        if product_id in self._product_cache:
            return self._product_cache[product_id]
        p = self.repository.get_by_id(product_id)
        if not p:
            return None
        all_products = self.repository.get_all()
        rich = self.map_to_rich_product(p, all_products)
        self._product_cache[product_id] = rich
        return rich

    def search_catalog(self, filters: Dict[str, Any]) -> List[RichProduct]:
        filter_key = str(sorted(filters.items()))
        if filter_key in self._search_cache:
            return self._search_cache[filter_key]
        products = self.repository.search_products(filters)
        all_products = self.repository.get_all()
        rich_list = [self.map_to_rich_product(p, all_products) for p in products]
        self._search_cache[filter_key] = rich_list
        return rich_list

    def get_all_products(self) -> List[RichProduct]:
        if self._all_products_cache is not None:
            return self._all_products_cache
        products = self.repository.get_all()
        rich_list = [self.map_to_rich_product(p, products) for p in products]
        self._all_products_cache = rich_list
        return rich_list
