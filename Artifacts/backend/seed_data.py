"""
Seed data script for StaffAlloc application.

This script populates the database with realistic test data including:
- Users (employees)
- Roles and LCATs
- Projects
- Project assignments
- Allocations

Run this script from the backend directory:
    python seed_data.py
"""
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add the app directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import SessionLocal
from app import models
from app.core.security import get_password_hash

# ============================================================================
# SEED DATA
# ============================================================================

ROLES = [
    {"name": "Software Engineer", "description": "Develops and maintains software applications"},
    {"name": "Senior Software Engineer", "description": "Senior-level software development"},
    {"name": "Engineering Manager", "description": "Manages engineering teams"},
    {"name": "Product Designer", "description": "Designs user experiences and interfaces"},
    {"name": "Data Scientist", "description": "Analyzes data and builds ML models"},
    {"name": "DevOps Engineer", "description": "Manages infrastructure and deployments"},
    {"name": "QA Engineer", "description": "Tests and ensures quality"},
    {"name": "Tech Lead", "description": "Technical leadership for projects"},
    {"name": "Full Stack Developer", "description": "Works on both frontend and backend"},
    {"name": "Frontend Developer", "description": "Specializes in UI development"},
]

LCATS = [
    {"name": "Junior Engineer", "description": "Entry-level engineering position"},
    {"name": "Engineer II", "description": "Mid-level engineering position"},
    {"name": "Senior Engineer", "description": "Senior engineering position"},
    {"name": "Staff Engineer", "description": "Staff-level engineering position"},
    {"name": "Engineering Manager", "description": "Team management position"},
    {"name": "Product Designer", "description": "Design position"},
    {"name": "Data Scientist", "description": "Data science position"},
    {"name": "DevOps Engineer", "description": "DevOps position"},
    {"name": "QA Engineer", "description": "Quality assurance position"},
    {"name": "Solutions Architect", "description": "Architecture position"},
]

USERS = [
    {
        "email": "jane.doe@staffalloc.com",
        "full_name": "Jane Doe",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "john.smith@staffalloc.com",
        "full_name": "John Smith",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "alice.johnson@staffalloc.com",
        "full_name": "Alice Johnson",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "bob.williams@staffalloc.com",
        "full_name": "Bob Williams",
        "password": "password123",
        "system_role": "Manager",
        "is_active": True,
    },
    {
        "email": "emily.brown@staffalloc.com",
        "full_name": "Emily Brown",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "michael.davis@staffalloc.com",
        "full_name": "Michael Davis",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "sarah.martinez@staffalloc.com",
        "full_name": "Sarah Martinez",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "david.garcia@staffalloc.com",
        "full_name": "David Garcia",
        "password": "password123",
        "system_role": "Manager",
        "is_active": True,
    },
    {
        "email": "jennifer.rodriguez@staffalloc.com",
        "full_name": "Jennifer Rodriguez",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "james.wilson@staffalloc.com",
        "full_name": "James Wilson",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "mary.taylor@staffalloc.com",
        "full_name": "Mary Taylor",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
    {
        "email": "robert.anderson@staffalloc.com",
        "full_name": "Robert Anderson",
        "password": "password123",
        "system_role": "User",
        "is_active": True,
    },
]

PROJECTS = [
    {
        "code": "PROJ-001",
        "name": "Mobile App Redesign",
        "client": "TechCorp Inc.",
        "start_date": (datetime.now() - timedelta(days=90)).date(),
        "sprints": 12,
        "status": "Active",
    },
    {
        "code": "PROJ-002",
        "name": "E-Commerce Platform",
        "client": "RetailMax",
        "start_date": (datetime.now() - timedelta(days=60)).date(),
        "sprints": 16,
        "status": "Active",
    },
    {
        "code": "PROJ-003",
        "name": "Data Analytics Dashboard",
        "client": "FinanceHub",
        "start_date": (datetime.now() - timedelta(days=30)).date(),
        "sprints": 8,
        "status": "Active",
    },
    {
        "code": "PROJ-004",
        "name": "Customer Portal",
        "client": "ServicePro",
        "start_date": (datetime.now() + timedelta(days=14)).date(),
        "sprints": 10,
        "status": "Planning",
    },
    {
        "code": "PROJ-005",
        "name": "Legacy System Migration",
        "client": "BankCorp",
        "start_date": (datetime.now() - timedelta(days=120)).date(),
        "sprints": 20,
        "status": "Active",
    },
    {
        "code": "PROJ-006",
        "name": "AI Chatbot Integration",
        "client": "SupportDesk",
        "start_date": (datetime.now() + timedelta(days=30)).date(),
        "sprints": 6,
        "status": "Planning",
    },
]


# ============================================================================
# SEED FUNCTIONS
# ============================================================================

def seed_roles(db):
    """Seed roles table"""
    print("Seeding roles...")
    created = 0
    for role_data in ROLES:
        existing = db.query(models.Role).filter_by(name=role_data["name"]).first()
        if not existing:
            role = models.Role(**role_data)
            db.add(role)
            created += 1
    db.commit()
    print(f"✅ Created {created} roles (skipped {len(ROLES) - created} existing)")


def seed_lcats(db):
    """Seed LCATs table"""
    print("Seeding LCATs...")
    created = 0
    for lcat_data in LCATS:
        existing = db.query(models.LCAT).filter_by(name=lcat_data["name"]).first()
        if not existing:
            lcat = models.LCAT(**lcat_data)
            db.add(lcat)
            created += 1
    db.commit()
    print(f"✅ Created {created} LCATs (skipped {len(LCATS) - created} existing)")


def seed_users(db):
    """Seed users table"""
    print("Seeding users...")
    created = 0

    for user_data in USERS:
        existing = db.query(models.User).filter_by(email=user_data["email"]).first()
        if not existing:
            # Hash the password
            password = user_data.pop("password")
            user_data["password_hash"] = get_password_hash(password)

            user = models.User(**user_data)
            db.add(user)
            created += 1

    db.commit()
    print(f"✅ Created {created} users (skipped {len(USERS) - created} existing)")


def seed_projects(db):
    """Seed projects table"""
    print("Seeding projects...")
    created = 0

    # Get admin user as manager
    admin = db.query(models.User).filter_by(email="admin@staffalloc.com").first()
    if not admin:
        print("⚠️  Admin user not found. Creating admin user first...")
        admin = models.User(
            email="admin@staffalloc.com",
            full_name="Admin User",
            password_hash=get_password_hash("admin123"),
            system_role="Admin",
            is_active=True,
        )
        db.add(admin)
        db.commit()

    for project_data in PROJECTS:
        existing = db.query(models.Project).filter_by(
            code=project_data["code"]
        ).first()
        if not existing:
            project_data["manager_id"] = admin.id
            project = models.Project(**project_data)
            db.add(project)
            created += 1

    db.commit()
    print(f"✅ Created {created} projects (skipped {len(PROJECTS) - created} existing)")


def seed_assignments_and_allocations(db):
    """Seed project assignments and allocations"""
    print("Seeding project assignments and allocations...")

    import random

    projects = db.query(models.Project).all()
    users = db.query(models.User).filter(models.User.email != "admin@staffalloc.com").all()
    roles = db.query(models.Role).all()
    lcats = db.query(models.LCAT).all()

    if not users or not roles or not lcats:
        print("⚠️  Not enough data to create assignments. Skipping...")
        return

    assignments_created = 0
    allocations_created = 0

    for project in projects:
        # Assign 3-5 random employees to each project
        num_employees = random.randint(3, min(5, len(users)))
        assigned_users = random.sample(users, num_employees)

        for user in assigned_users:
            # Check if assignment already exists
            existing = db.query(models.ProjectAssignment).filter_by(
                project_id=project.id,
                user_id=user.id
            ).first()

            if existing:
                continue

            # Create assignment with random role, LCAT, and funded hours (500-1000)
            assignment = models.ProjectAssignment(
                project_id=project.id,
                user_id=user.id,
                role_id=random.choice(roles).id,
                lcat_id=random.choice(lcats).id,
                funded_hours=random.randint(500, 1000)
            )
            db.add(assignment)
            db.flush()  # Get the assignment ID
            assignments_created += 1

            # Create allocations for this assignment
            # Generate monthly allocations for the project duration
            from datetime import date
            current_year = project.start_date.year
            current_month = project.start_date.month
            num_months = (project.sprints * 2) // 4  # 2 weeks per sprint, ~4 weeks per month

            for i in range(num_months):
                # Check if allocation already exists
                existing_alloc = db.query(models.Allocation).filter_by(
                    project_assignment_id=assignment.id,
                    year=current_year,
                    month=current_month
                ).first()

                if not existing_alloc:
                    # Random hours between 40-160 (25%-100% allocation)
                    allocated_hours = random.choice([40, 80, 120, 160])

                    allocation = models.Allocation(
                        project_assignment_id=assignment.id,
                        year=current_year,
                        month=current_month,
                        allocated_hours=allocated_hours
                    )
                    db.add(allocation)
                    allocations_created += 1

                # Move to next month
                if current_month == 12:
                    current_year += 1
                    current_month = 1
                else:
                    current_month += 1

    db.commit()
    print(f"✅ Created {assignments_created} project assignments")
    print(f"✅ Created {allocations_created} allocations")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main function to seed all data"""
    print("=" * 80)
    print("StaffAlloc Database Seeding")
    print("=" * 80)
    print()

    db = SessionLocal()

    try:
        seed_roles(db)
        seed_lcats(db)
        seed_users(db)
        seed_projects(db)
        seed_assignments_and_allocations(db)

        print()
        print("=" * 80)
        print("✅ Database seeding completed successfully!")
        print("=" * 80)
        print()
        print("Test credentials:")
        print("  Email: admin@staffalloc.com")
        print("  Password: admin123")
        print()
        print("All other users:")
        print("  Password: password123")
        print()

    except Exception as e:
        print(f"\n❌ Error during seeding: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
