from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.profile import get_user_profile
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductOut, ProductReorderRequest, ProductUpdate

router = APIRouter(prefix="/me/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Product]:
    profile = get_user_profile(db, current_user)
    return (
        db.query(Product)
        .filter(Product.profile_id == profile.id)
        .order_by(Product.position.asc(), Product.created_at.asc())
        .all()
    )


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Product:
    profile = get_user_profile(db, current_user)
    max_pos = (
        db.query(Product.position)
        .filter(Product.profile_id == profile.id)
        .order_by(Product.position.desc())
        .first()
    )
    position = (max_pos[0] + 1) if max_pos else 0
    product = Product(
        profile_id=profile.id,
        title=payload.title,
        description=payload.description,
        price_label=payload.price_label,
        checkout_url=payload.checkout_url,
        thumbnail_url=payload.thumbnail_url,
        is_active=payload.is_active,
        position=position,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/reorder", response_model=list[ProductOut])
def reorder_products(
    payload: ProductReorderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Product]:
    profile = get_user_profile(db, current_user)
    products = {
        str(p.id): p for p in db.query(Product).filter(Product.profile_id == profile.id).all()
    }
    for item in payload.items:
        product = products.get(str(item.id))
        if product:
            product.position = item.position
    db.commit()
    return sorted(products.values(), key=lambda p: p.position)


@router.patch("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Product:
    profile = get_user_profile(db, current_user)
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.profile_id == profile.id)
        .first()
    )
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    data = payload.model_dump(exclude_unset=True)
    for field in ("title", "checkout_url", "is_active"):
        if field in data and data[field] is not None:
            setattr(product, field, data[field])

    if data.get("clear_description"):
        product.description = None
    elif "description" in data:
        product.description = data["description"]

    if data.get("clear_price_label"):
        product.price_label = None
    elif "price_label" in data:
        product.price_label = data["price_label"]

    if data.get("clear_thumbnail"):
        product.thumbnail_url = None
    elif "thumbnail_url" in data:
        product.thumbnail_url = data["thumbnail_url"]

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    profile = get_user_profile(db, current_user)
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.profile_id == profile.id)
        .first()
    )
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
