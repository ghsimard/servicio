import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check user relationships
    const userWithRelations = await prisma.users.findFirst({
      include: {
        user_roles: true,
        user_contacts: true,
        bookings: true,
        addresses: true,
        companies: true,
        subscriptions_users_subscription_idTosubscriptions: true,
        helper_services: true,
        contracts_contracts_helper_idTousers: true,
        contracts_contracts_needer_idTousers: true,
        helper_certifications_helper_certifications_helper_idTousers: true
      }
    });

    console.log('\nUser relationships check:');
    if (userWithRelations) {
      console.log('\nUser ID:', userWithRelations.user_id);
      console.log('User Roles:', userWithRelations.user_roles.length);
      console.log('User Contacts:', userWithRelations.user_contacts.length);
      console.log('Bookings:', userWithRelations.bookings.length);
      console.log('Address:', userWithRelations.addresses ? 'Present' : 'None');
      console.log('Company:', userWithRelations.companies ? 'Present' : 'None');
      console.log('Subscription:', userWithRelations.subscriptions_users_subscription_idTosubscriptions ? 'Present' : 'None');
      console.log('Helper Services:', userWithRelations.helper_services.length);
      console.log('Helper Contracts:', userWithRelations.contracts_contracts_helper_idTousers.length);
      console.log('Needer Contracts:', userWithRelations.contracts_contracts_needer_idTousers.length);
      console.log('Certifications:', userWithRelations.helper_certifications_helper_certifications_helper_idTousers.length);
    } else {
      console.log('No users found');
    }

    // Check referential integrity
    console.log('\nChecking referential integrity...');
    
    // Check user_roles references
    const invalidUserRoles = await prisma.user_roles.findMany({
      where: {
        user_id: {
          notIn: (await prisma.users.findMany({
            select: { user_id: true }
          })).map(u => u.user_id)
        }
      }
    });
    
    console.log('Invalid user role references:', invalidUserRoles.length);

    // Check cascade delete behavior
    console.log('\nChecking cascade delete settings:');
    const schema = await prisma.$queryRaw`
      SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.update_rule,
        rc.delete_rule
      FROM 
        information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        JOIN information_schema.referential_constraints rc
          ON tc.constraint_name = rc.constraint_name
          AND tc.table_schema = rc.constraint_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (tc.table_name = 'users'
         OR tc.table_name = 'user_roles'
         OR tc.table_name = 'user_contacts'
         OR tc.table_name = 'helper_services'
         OR tc.table_name = 'bookings'
         OR tc.table_name = 'contracts');
    `;
    
    console.log('\nForeign key constraints:');
    console.log(JSON.stringify(schema, null, 2));

  } catch (error) {
    console.error('Error checking foreign keys:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 