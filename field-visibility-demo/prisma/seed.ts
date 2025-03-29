import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface VisibilityRules {
  required: boolean;
  adminControlled: boolean;
  helperSwitchable: boolean;
  isVisible: boolean;
}

async function main() {
  try {
    // Create test users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      }),
      prisma.user.create({
        data: {
          email: 'john@example.com',
          name: 'John Doe',
        },
      }),
      prisma.user.create({
        data: {
          email: 'jane@example.com',
          name: 'Jane Smith',
        },
      }),
      prisma.user.create({
        data: {
          email: 'alice@example.com',
          name: 'Alice Johnson',
        },
      }),
      prisma.user.create({
        data: {
          email: 'bob@example.com',
          name: 'Bob Wilson',
        },
      }),
    ]);

    console.log('Created users:', users);

    // Create field definitions
    const fields = await Promise.all([
      // Basic Information
      prisma.fieldDefinition.create({
        data: {
          entityType: 'user_profile',
          fieldName: 'email',
          displayName: 'Email Address',
          fieldType: 'text',
          defaultVisibility: {
            required: true,
            adminControlled: true,
            helperSwitchable: false,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          entityType: 'user_profile',
          fieldName: 'phone',
          displayName: 'Phone Number',
          fieldType: 'text',
          defaultVisibility: {
            required: true,
            adminControlled: true,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'address',
          displayName: 'Address',
          entityType: 'Basic Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'city',
          displayName: 'City',
          entityType: 'Basic Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'state',
          displayName: 'State',
          entityType: 'Basic Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),

      // Professional Information
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'title',
          displayName: 'Job Title',
          entityType: 'Professional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: true,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'company',
          displayName: 'Company',
          entityType: 'Professional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: true,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'department',
          displayName: 'Department',
          entityType: 'Professional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'start_date',
          displayName: 'Start Date',
          entityType: 'Professional Information',
          fieldType: 'date',
          defaultVisibility: {
            required: true,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'salary',
          displayName: 'Salary',
          entityType: 'Professional Information',
          fieldType: 'number',
          defaultVisibility: {
            required: false,
            adminControlled: true,
            helperSwitchable: false,
            isVisible: false,
          } as Prisma.InputJsonValue,
        },
      }),

      // Skills and Qualifications
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'languages',
          displayName: 'Languages',
          entityType: 'Skills',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'certifications',
          displayName: 'Certifications',
          entityType: 'Skills',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'technical_skills',
          displayName: 'Technical Skills',
          entityType: 'Skills',
          fieldType: 'text',
          defaultVisibility: {
            required: true,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'soft_skills',
          displayName: 'Soft Skills',
          entityType: 'Skills',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'education',
          displayName: 'Education',
          entityType: 'Skills',
          fieldType: 'text',
          defaultVisibility: {
            required: true,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),

      // Additional Information
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'bio',
          displayName: 'Biography',
          entityType: 'Additional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'interests',
          displayName: 'Interests',
          entityType: 'Additional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'social_links',
          displayName: 'Social Links',
          entityType: 'Additional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'preferences',
          displayName: 'Preferences',
          entityType: 'Additional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
      prisma.fieldDefinition.create({
        data: {
          fieldName: 'notes',
          displayName: 'Notes',
          entityType: 'Additional Information',
          fieldType: 'text',
          defaultVisibility: {
            required: false,
            adminControlled: false,
            helperSwitchable: true,
            isVisible: true,
          } as Prisma.InputJsonValue,
        },
      }),
    ]);

    console.log('Created fields:', fields);

    // Create user field visibilities for each user
    for (const user of users) {
      for (const field of fields) {
        await prisma.userFieldVisibility.create({
          data: {
            userId: user.id,
            fieldDefId: field.id,
            visibilityRules: field.defaultVisibility as Prisma.InputJsonValue,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 