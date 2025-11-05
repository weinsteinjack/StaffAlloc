import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/config",
    tags=["Configuration"],
    responses={404: {"description": "Not found"}},
)

# ======================================================================================
# Roles Endpoints
# ======================================================================================

@router.post(
    "/roles/",
    response_model=schemas.RoleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new role",
)
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db)):
    """
    Create a new job role (e.g., 'Software Engineer', 'Project Manager').
    """
    created_role = crud.create_role(db=db, role=role)
    logger.info(f"Role created with ID: {created_role.id}")
    return created_role


@router.get(
    "/roles/",
    response_model=List[schemas.RoleResponse],
    summary="Get all roles",
)
def read_roles(
    skip: int = 0,
    limit: int = Query(default=100, lte=200),
    db: Session = Depends(get_db),
):
    """
    Retrieve a list of all available job roles.
    """
    roles = crud.get_roles(db, skip=skip, limit=limit)
    return roles


@router.get(
    "/roles/{role_id}",
    response_model=schemas.RoleResponse,
    summary="Get a role by ID",
)
def read_role(role_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single role by its ID.
    """
    db_role = crud.get_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    return db_role


@router.put(
    "/roles/{role_id}",
    response_model=schemas.RoleResponse,
    summary="Update a role",
)
def update_role(
    role_id: int, role_update: schemas.RoleUpdate, db: Session = Depends(get_db)
):
    """
    Update an existing role's name or description.
    """
    updated_role = crud.update_role(db, role_id=role_id, role_update=role_update)
    if updated_role is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    logger.info(f"Role with ID {role_id} was updated.")
    return updated_role


@router.delete(
    "/roles/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a role",
)
def delete_role(role_id: int, db: Session = Depends(get_db)):
    """
    Delete a role. This may fail if the role is currently in use by any project assignments.
    """
    success = crud.delete_role(db, role_id=role_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found or in use")
    logger.info(f"Role with ID {role_id} was deleted.")
    return None


# ======================================================================================
# LCATs Endpoints
# ======================================================================================

@router.post(
    "/lcats/",
    response_model=schemas.LCATResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new LCAT",
)
def create_lcat(lcat: schemas.LCATCreate, db: Session = Depends(get_db)):
    """
    Create a new Labor Category (e.g., 'Level 1', 'Senior').
    """
    created_lcat = crud.create_lcat(db=db, lcat=lcat)
    logger.info(f"LCAT created with ID: {created_lcat.id}")
    return created_lcat


@router.get(
    "/lcats/",
    response_model=List[schemas.LCATResponse],
    summary="Get all LCATs",
)
def read_lcats(
    skip: int = 0,
    limit: int = Query(default=100, lte=200),
    db: Session = Depends(get_db),
):
    """
    Retrieve a list of all available Labor Categories.
    """
    lcats = crud.get_lcats(db, skip=skip, limit=limit)
    return lcats


@router.get(
    "/lcats/{lcat_id}",
    response_model=schemas.LCATResponse,
    summary="Get an LCAT by ID",
)
def read_lcat(lcat_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single LCAT by its ID.
    """
    db_lcat = crud.get_lcat(db, lcat_id=lcat_id)
    if db_lcat is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LCAT not found")
    return db_lcat


@router.put(
    "/lcats/{lcat_id}",
    response_model=schemas.LCATResponse,
    summary="Update an LCAT",
)
def update_lcat(
    lcat_id: int, lcat_update: schemas.LCATUpdate, db: Session = Depends(get_db)
):
    """
    Update an existing LCAT's name or description.
    """
    updated_lcat = crud.update_lcat(db, lcat_id=lcat_id, lcat_update=lcat_update)
    if updated_lcat is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LCAT not found")
    logger.info(f"LCAT with ID {lcat_id} was updated.")
    return updated_lcat


@router.delete(
    "/lcats/{lcat_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an LCAT",
)
def delete_lcat(lcat_id: int, db: Session = Depends(get_db)):
    """
    Delete an LCAT. This may fail if the LCAT is in use by any project assignments.
    """
    success = crud.delete_lcat(db, lcat_id=lcat_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LCAT not found or in use")
    logger.info(f"LCAT with ID {lcat_id} was deleted.")
    return None