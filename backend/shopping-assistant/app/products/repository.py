import sqlite3
import re
from pathlib import Path
from typing import List, Optional, Dict, Any
from app.config import Config
from app.products.models import Product, SavedLook, Order
from app.products.seed import SEED_PRODUCTS, CATALOG_SEED_VERSION
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
            conn.execute("""
                CREATE TABLE IF NOT EXISTS app_metadata (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            """)

            version_row = conn.execute(
                "SELECT value FROM app_metadata WHERE key = 'catalog_seed_version'"
            ).fetchone()
            stored_seed_version = version_row["value"] if version_row else None
            should_reseed_catalog = stored_seed_version != CATALOG_SEED_VERSION

            # Migration check: drop table if old schema exists
            cursor = conn.execute("PRAGMA table_info(products)")
            cols = [row[1] for row in cursor.fetchall()]
            if cols and "collection_name" not in cols:
                logger.info("Migrating products table: dropping old schema for collection_name...")
                conn.execute("DROP TABLE IF EXISTS products")
                should_reseed_catalog = True

            if should_reseed_catalog:
                logger.info(
                    "Catalog seed version changed from %s to %s. Rebuilding products table.",
                    stored_seed_version,
                    CATALOG_SEED_VERSION,
                )
                conn.execute("DROP TABLE IF EXISTS products")

            # Migration check for saved_looks: drop table if old schema exists
            cursor = conn.execute("PRAGMA table_info(saved_looks)")
            saved_cols = [row[1] for row in cursor.fetchall()]
            if saved_cols and "session_id" not in saved_cols:
                logger.info("Migrating saved_looks table: dropping old schema for session_id...")
                conn.execute("DROP TABLE IF EXISTS saved_looks")

            # Migration check for orders: drop table if missing outerwear_product_id column
            cursor = conn.execute("PRAGMA table_info(orders)")
            order_cols = [row[1] for row in cursor.fetchall()]
            if order_cols and "outerwear_product_id" not in order_cols:
                logger.info("Migrating orders table: dropping old schema for outerwear_product_id/shoes_product_id...")
                conn.execute("DROP TABLE IF EXISTS orders")

            # Create products table with overlay coords & collection_name
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
                    image_path TEXT,
                    overlay_top_percent REAL,
                    overlay_left_percent REAL,
                    overlay_width_percent REAL,
                    collection_name TEXT
                )
            """)
            
            # Create saved_looks table with updated columns
            conn.execute("""
                CREATE TABLE IF NOT EXISTS saved_looks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    top_id INTEGER,
                    bottom_id INTEGER,
                    outerwear_id INTEGER,
                    shoes_id INTEGER,
                    total_price REAL NOT NULL,
                    aesthetic_rating TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create orders table starting at 1000
            conn.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    top_product_id INTEGER,
                    bottom_product_id INTEGER,
                    outerwear_product_id INTEGER,
                    shoes_product_id INTEGER,
                    total_price REAL NOT NULL,
                    order_status TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            # Adjust auto-increment sequence starting point
            conn.execute("INSERT OR IGNORE INTO sqlite_sequence (name, seq) VALUES ('orders', 999)")
            conn.commit()

            # Check if empty
            cursor = conn.execute("SELECT COUNT(*) FROM products")
            count = cursor.fetchone()[0]
            if count == 0:
                logger.info("Database is empty. Seeding catalog with realistic fashion products...")
                for p in SEED_PRODUCTS:
                    conn.execute("""
                        INSERT INTO products (
                            id, name, description, brand, category, style_tags, color, size_options, price, gender, season, stock_quantity, image_path,
                            overlay_top_percent, overlay_left_percent, overlay_width_percent, collection_name
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        p["id"], p["name"], p["description"], p["brand"], p["category"],
                        p["style_tags"], p["color"], p["size_options"], p["price"],
                        p["gender"], p["season"], p["stock_quantity"], p.get("image_path"),
                        p.get("overlay_top_percent", 0.0), p.get("overlay_left_percent", 0.0), p.get("overlay_width_percent", 100.0),
                        p.get("collection_name")
                    ))
                conn.execute(
                    """
                    INSERT INTO app_metadata (key, value)
                    VALUES ('catalog_seed_version', ?)
                    ON CONFLICT(key) DO UPDATE SET value = excluded.value
                    """,
                    (CATALOG_SEED_VERSION,),
                )
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
            image_path=row["image_path"],
            overlay_top_percent=row["overlay_top_percent"],
            overlay_left_percent=row["overlay_left_percent"],
            overlay_width_percent=row["overlay_width_percent"],
            collection_name=row["collection_name"]
        )

    def save_look(self, look: SavedLook) -> SavedLook:
        with self._get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO saved_looks (session_id, name, top_id, bottom_id, outerwear_id, shoes_id, total_price, aesthetic_rating)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (look.session_id, look.name, look.top_id, look.bottom_id, look.outerwear_id, look.shoes_id, look.total_price, look.aesthetic_rating))
            look_id = cursor.lastrowid
            conn.commit()
            
            row = conn.execute("SELECT * FROM saved_looks WHERE id = ?", (look_id,)).fetchone()
            return SavedLook(
                id=row["id"],
                session_id=row["session_id"],
                name=row["name"],
                top_id=row["top_id"],
                bottom_id=row["bottom_id"],
                outerwear_id=row["outerwear_id"],
                shoes_id=row["shoes_id"],
                total_price=row["total_price"],
                aesthetic_rating=row["aesthetic_rating"],
                created_at=str(row["created_at"])
            )

    def get_saved_looks(self, session_id: Optional[str] = None) -> List[SavedLook]:
        with self._get_connection() as conn:
            if session_id:
                cursor = conn.execute("SELECT * FROM saved_looks WHERE session_id = ? ORDER BY created_at DESC", (session_id,))
            else:
                cursor = conn.execute("SELECT * FROM saved_looks ORDER BY created_at DESC")
            looks = []
            for row in cursor.fetchall():
                looks.append(SavedLook(
                    id=row["id"],
                    session_id=row["session_id"],
                    name=row["name"],
                    top_id=row["top_id"],
                    bottom_id=row["bottom_id"],
                    outerwear_id=row["outerwear_id"],
                    shoes_id=row["shoes_id"],
                    total_price=row["total_price"],
                    aesthetic_rating=row["aesthetic_rating"],
                    created_at=str(row["created_at"])
                ))
            return looks

    def delete_look(self, look_id: int) -> bool:
        with self._get_connection() as conn:
            cursor = conn.execute("DELETE FROM saved_looks WHERE id = ?", (look_id,))
            conn.commit()
            return cursor.rowcount > 0

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
            keyword = filters["keyword"].strip().lower()
            terms = [term for term in re.split(r"\s+", keyword) if term]
            searchable_fields = [
                "LOWER(name)",
                "LOWER(description)",
                "LOWER(style_tags)",
                "LOWER(brand)",
                "LOWER(category)",
            ]

            for term in terms:
                term_clause = " OR ".join(f"{field} LIKE ?" for field in searchable_fields)
                query += f" AND ({term_clause})"
                params.extend([f"%{term}%"] * len(searchable_fields))

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

    def create_order(self, top_id: Optional[int], bottom_id: Optional[int], price: float,
                     outerwear_product_id: Optional[int] = None, shoes_product_id: Optional[int] = None) -> Order:
        with self._get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO orders (top_product_id, bottom_product_id, outerwear_product_id, shoes_product_id, total_price, order_status)
                VALUES (?, ?, ?, ?, ?, 'purchased')
            """, (top_id, bottom_id, outerwear_product_id, shoes_product_id, price))
            order_id = cursor.lastrowid
            conn.commit()
            
            row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
            return Order(
                id=row["id"],
                top_product_id=row["top_product_id"],
                bottom_product_id=row["bottom_product_id"],
                outerwear_product_id=row["outerwear_product_id"],
                shoes_product_id=row["shoes_product_id"],
                total_price=row["total_price"],
                order_status=row["order_status"],
                created_at=str(row["created_at"])
            )

    def get_order(self, order_id: int) -> Optional[Order]:
        with self._get_connection() as conn:
            row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
            if not row:
                return None
            return Order(
                id=row["id"],
                top_product_id=row["top_product_id"],
                bottom_product_id=row["bottom_product_id"],
                outerwear_product_id=row["outerwear_product_id"],
                shoes_product_id=row["shoes_product_id"],
                total_price=row["total_price"],
                order_status=row["order_status"],
                created_at=str(row["created_at"])
            )

    def update_order_status(self, order_id: int, status: str) -> Optional[Order]:
        with self._get_connection() as conn:
            conn.execute("UPDATE orders SET order_status = ? WHERE id = ?", (status, order_id))
            conn.commit()
            return self.get_order(order_id)

    def get_pending_returns(self) -> List[Order]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT * FROM orders WHERE order_status = 'awaiting_return_approval' ORDER BY created_at DESC")
            orders = []
            for row in cursor.fetchall():
                orders.append(Order(
                    id=row["id"],
                    top_product_id=row["top_product_id"],
                    bottom_product_id=row["bottom_product_id"],
                    outerwear_product_id=row["outerwear_product_id"],
                    shoes_product_id=row["shoes_product_id"],
                    total_price=row["total_price"],
                    order_status=row["order_status"],
                    created_at=str(row["created_at"])
                ))
            return orders
