import sqlite3
from pathlib import Path
from typing import List, Optional, Dict, Any
from app.config import Config
from app.products.models import Product
from app.products.seed import SEED_PRODUCTS
import logging

logger = logging.getLogger(__name__)

class ProductRepository:
    def __init__(self):
        # Parse DATABASE_URL: e.g. "sqlite:///shopping_assistant.db"
        db_url = Config.Database.DATABASE_URL
        db_file = db_url.replace("sqlite:///", "")

        # If relative, resolve to project root (parent of app dir)
        # app is at d:\retail-pilot\backend\shopping-assistant\app
        # project root is d:\retail-pilot\backend\shopping-assistant
        app_dir = Path(__file__).parent.parent.resolve()
        project_root = app_dir.parent
        self.db_path = project_root / db_file

        # Ensure parent directories exist
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

        # Initialize schema and seed database
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        """Initializes the database schema and seeds it if empty."""
        with self._get_connection() as conn:
            # Create products table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    brand TEXT NOT NULL,
                    category TEXT NOT NULL,
                    style_tags TEXT NOT NULL,
                    color TEXT NOT NULL,
                    size_options TEXT NOT NULL,
                    price REAL NOT NULL,
                    gender TEXT NOT NULL,
                    season TEXT NOT NULL,
                    stock_quantity INTEGER NOT NULL,
                    image_path TEXT
                )
            """)
            conn.commit()

            # Check if empty
            cursor = conn.execute("SELECT COUNT(*) FROM products")
            count = cursor.fetchone()[0]
            if count == 0:
                logger.info("Database is empty. Seeding catalog with realistic fashion products...")
                for p in SEED_PRODUCTS:
                    conn.execute("""
                        INSERT INTO products (
                            id, name, description, brand, category, style_tags, color, size_options, price, gender, season, stock_quantity, image_path
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        p["id"], p["name"], p["description"], p["brand"], p["category"],
                        p["style_tags"], p["color"], p["size_options"], p["price"],
                        p["gender"], p["season"], p["stock_quantity"], p.get("image_path")
                    ))
                conn.commit()
                logger.info(f"Seeded {len(SEED_PRODUCTS)} products successfully.")

    def _row_to_model(self, row: sqlite3.Row) -> Product:
        return Product(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            brand=row["brand"],
            category=row["category"],
            style_tags=[tag.strip() for tag in row["style_tags"].split(",") if tag.strip()],
            color=row["color"],
            size_options=[sz.strip() for sz in row["size_options"].split(",") if sz.strip()],
            price=row["price"],
            gender=row["gender"],
            season=row["season"],
            stock_quantity=row["stock_quantity"],
            image_path=row["image_path"]
        )

    def get_all(self) -> List[Product]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT * FROM products")
            return [self._row_to_model(row) for row in cursor.fetchall()]

    def get_by_id(self, product_id: int) -> Optional[Product]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,))
            row = cursor.fetchone()
            return self._row_to_model(row) if row else None

    def search_products(self, filters: Dict[str, Any]) -> List[Product]:
        """Performs a flexible filter-based search.

        Supported filters:
        - keyword: matches name or description (case-insensitive substring)
        - category: exact match (case-insensitive)
        - brand: exact match (case-insensitive)
        - style: matches single style tag (case-insensitive substring of style_tags)
        - color: exact match (case-insensitive)
        - season: exact match (case-insensitive)
        - gender: exact match (case-insensitive)
        - min_price: price >= min_price
        - max_price: price <= max_price
        """
        query = "SELECT * FROM products WHERE 1=1"
        params = []

        # 1. Keyword search (name or description)
        if "keyword" in filters and filters["keyword"]:
            query += " AND (name LIKE ? OR description LIKE ?)"
            kw = f"%{filters['keyword']}%"
            params.extend([kw, kw])

        # 2. Category search
        if "category" in filters and filters["category"]:
            query += " AND LOWER(category) = ?"
            params.append(filters["category"].lower())

        # 3. Brand search
        if "brand" in filters and filters["brand"]:
            query += " AND LOWER(brand) = ?"
            params.append(filters["brand"].lower())

        # 4. Style search
        if "style" in filters and filters["style"]:
            query += " AND LOWER(style_tags) LIKE ?"
            params.append(f"%{filters['style'].lower()}%")

        # 5. Color search
        if "color" in filters and filters["color"]:
            query += " AND LOWER(color) = ?"
            params.append(filters["color"].lower())

        # 6. Season search
        if "season" in filters and filters["season"]:
            query += " AND LOWER(season) LIKE ?"
            params.append(f"%{filters['season'].lower()}%")

        # 7. Gender search
        if "gender" in filters and filters["gender"]:
            query += " AND LOWER(gender) = ?"
            params.append(filters["gender"].lower())

        # 8. Price range search
        if "min_price" in filters and filters["min_price"] is not None:
            query += " AND price >= ?"
            params.append(float(filters["min_price"]))
        if "max_price" in filters and filters["max_price"] is not None:
            query += " AND price <= ?"
            params.append(float(filters["max_price"]))

        with self._get_connection() as conn:
            cursor = conn.execute(query, params)
            return [self._row_to_model(row) for row in cursor.fetchall()]
