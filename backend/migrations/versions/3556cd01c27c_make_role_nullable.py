"""Make role nullable

Revision ID: 3556cd01c27c
Revises: b4ff15094f96
Create Date: 2025-04-13 14:57:16.391693

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3556cd01c27c'
down_revision: Union[str, None] = 'b4ff15094f96'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TABLE users ALTER COLUMN role DROP NOT NULL")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TABLE users ALTER COLUMN role SET NOT NULL")
