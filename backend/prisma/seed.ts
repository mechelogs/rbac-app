import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // -----------------------------------
  // ROLES
  // -----------------------------------

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      permissions: 'read'
    }
  })

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      permissions: 'read,create,update,delete'
    }
  })

  // -----------------------------------
  // ORGANIZATION
  // -----------------------------------

  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Corporation'
    }
  })

  // -----------------------------------
  // TEAMS
  // -----------------------------------

  const engineeringTeam = await prisma.team.create({
    data: {
      name: 'Engineering',
      organizationId: organization.id
    }
  })

  const marketingTeam = await prisma.team.create({
    data: {
      name: 'Marketing',
      organizationId: organization.id
    }
  })

  // -----------------------------------
  // PASSWORD
  // -----------------------------------

  const hashedPassword = await bcrypt.hash('password123', 10)

  // -----------------------------------
  // USERS
  // -----------------------------------

  const viewerUser = await prisma.user.create({
    data: {
      name: 'Viewer User',
      email: 'viewer@example.com',
      password: hashedPassword,
      organizationId: organization.id,
      teamId: marketingTeam.id,
      roleId: viewerRole.id
    }
  })

  const editorUser = await prisma.user.create({
    data: {
      name: 'Editor User',
      email: 'editor@example.com',
      password: hashedPassword,
      organizationId: organization.id,
      teamId: engineeringTeam.id,
      roleId: editorRole.id
    }
  })

  // -----------------------------------
  // CONTENT
  // -----------------------------------

  await prisma.content.createMany({
    data: [
      {
        title: 'Welcome Content',
        body: 'This content is assigned to Viewer User.',
        assignedTo: viewerUser.id
      },
      {
        title: 'Engineering Update',
        body: 'This content is assigned to Editor User.',
        assignedTo: editorUser.id
      },
      {
        title: 'Company Announcement',
        body: 'Quarterly meeting this Friday.',
        assignedTo: editorUser.id
      }
    ]
  })

  console.log('Database seeded successfully!')
  console.log('-----------------------------------')
  console.log('Viewer Login:')
  console.log('Email: viewer@example.com')
  console.log('Password: password123')
  console.log('-----------------------------------')
  console.log('Editor Login:')
  console.log('Email: editor@example.com')
  console.log('Password: password123')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })