"""create experiences table

Revision ID: create_experiences_table
Revises: change_professional_info_id_to_uuid
Create Date: 2024-04-26 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'create_experiences_table'
down_revision = 'change_professional_info_id_to_uuid'
branch_labels = None
depends_on = None

def upgrade():
    # Create experiences table
    op.create_table(
        'experiences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('professional_info_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('professional_info.id'), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('company', sa.String(), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), onupdate=sa.text('now()'))
    )
    op.create_index(op.f('ix_experiences_id'), 'experiences', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_experiences_id'), table_name='experiences')
    op.drop_table('experiences') 