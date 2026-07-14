from app.planner.schemas import ExecutionPlan

class ExecutionValidator:
    @staticmethod
    def validate(plan: ExecutionPlan) -> bool:
        if plan.query:
            low_query = plan.query.lower()
            if any(sql in low_query for sql in ["select ", "insert ", "update ", "delete ", "drop table", "union select"]):
                return False

        for step in plan.steps:
            args = step.arguments

            # 1. Product ID bounds check
            if "product_id" in args:
                pid = args["product_id"]
                if not isinstance(pid, int) or pid <= 0 or pid > 100000:
                    return False

            # 2. Order ID bounds check
            if "order_id" in args:
                oid = args["order_id"]
                if not isinstance(oid, int) or oid <= 0 or oid > 100000:
                    return False

            # 3. Budget bounds check
            if "budget" in args and args["budget"] is not None:
                b = args["budget"]
                if not isinstance(b, (int, float)) or b < 0:
                    return False

            # 4. Check for direct SQL injection patterns in strings
            for key, val in args.items():
                if isinstance(val, str):
                    low = val.lower()
                    if any(sql in low for sql in ["select ", "insert ", "update ", "delete ", "drop table", "union select"]):
                        return False

        return True
