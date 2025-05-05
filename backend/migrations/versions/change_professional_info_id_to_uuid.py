"""change professional info id to uuid

Revision ID: change_professional_info_id_to_uuid
Revises: 7a8266fa95da
Create Date: 2024-03-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid

# revision identifiers, used by Alembic.
revision = 'change_professional_info_id_to_uuid'
down_revision = '7a8266fa95da'
branch_labels = None
depends_on = None

def upgrade():
    # Create new UUID column
    op.add_column('professional_info', sa.Column('uuid_id', UUID(as_uuid=True), nullable=True))
    
    # Generate UUIDs for existing records
    connection = op.get_bind()
    connection.execute("UPDATE professional_info SET uuid_id = gen_random_uuid()")
    
    # Make UUID column not nullable
    op.alter_column('professional_info', 'uuid_id', nullable=False)
    
    # Update foreign key references in related tables
    op.alter_column('projects', 'professional_info_id', type_=UUID(as_uuid=True), postgresql_using="professional_info_id::uuid")
    op.alter_column('experiences', 'professional_info_id', type_=UUID(as_uuid=True), postgresql_using="professional_info_id::uuid")
    op.alter_column('educations', 'professional_info_id', type_=UUID(as_uuid=True), postgresql_using="professional_info_id::uuid")
    
    # Drop the old primary key constraint
    op.drop_constraint('professional_info_pkey', 'professional_info', type_='primary')
    
    # Drop the old id column
    op.drop_column('professional_info', 'id')
    
    # Rename uuid_id to id
    op.alter_column('professional_info', 'uuid_id', new_column_name='id')
    
    # Add new primary key constraint
    op.create_primary_key('professional_info_pkey', 'professional_info', ['id'])

def downgrade():
    # This is a complex change that would require careful handling of existing data
    # For safety, we'll raise an error if someone tries to downgrade
    raise NotImplementedError("Downgrading this migration is not supported") 