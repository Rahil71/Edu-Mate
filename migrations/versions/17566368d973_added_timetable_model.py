"""Added Timetable model

Revision ID: 17566368d973
Revises: 6d55600ba5c3
Create Date: 2025-06-26 09:40:11.133312

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '17566368d973'
down_revision = '6d55600ba5c3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('timetable',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uploader_id', sa.Integer(), nullable=False),
    sa.Column('batch_id', sa.Integer(), nullable=False),
    sa.Column('id_pdf', sa.Boolean(), nullable=True),
    sa.Column('pdf_filename', sa.String(length=200), nullable=True),
    sa.Column('date', sa.String(length=15), nullable=True),
    sa.Column('time', sa.String(length=20), nullable=True),
    sa.Column('subject', sa.String(length=100), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['batch_id'], ['batch.id'], ),
    sa.ForeignKeyConstraint(['uploader_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('timetable')
    # ### end Alembic commands ###
