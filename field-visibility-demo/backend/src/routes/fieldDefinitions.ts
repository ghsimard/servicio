import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all field definitions
router.get('/', async (_req, res) => {
  try {
    console.log('Fetching field definitions...');
    const fields = await prisma.fieldDefinition.findMany();
    console.log('Found fields:', fields);
    return res.json(fields);
  } catch (error) {
    console.error('Error fetching field definitions:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch field definitions',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Create a new field definition
router.post('/', async (req, res) => {
  try {
    const field = await prisma.fieldDefinition.create({
      data: {
        entityType: req.body.entityType,
        fieldName: req.body.fieldName,
        displayName: req.body.displayName,
        fieldType: req.body.fieldType,
        defaultVisibility: req.body.defaultVisibility,
      },
    });
    return res.json(field);
  } catch (error) {
    console.error('Error creating field definition:', error);
    return res.status(500).json({ 
      error: 'Failed to create field definition',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Update a field definition
router.put('/:id', async (req, res) => {
  try {
    // First get the current field definition
    const currentField = await prisma.fieldDefinition.findUnique({
      where: { id: req.params.id },
    });

    if (!currentField) {
      return res.status(404).json({ error: 'Field not found' });
    }

    // Get selected user IDs and the key that was changed from the request body
    const selectedUserIds = req.body.selectedUserIds || [];
    const changedKey = req.body.changedKey;

    // Update the field definition
    const field = await prisma.fieldDefinition.update({
      where: { id: req.params.id },
      data: {
        displayName: req.body.displayName,
        fieldType: req.body.fieldType,
        defaultVisibility: req.body.defaultVisibility,
      },
    });

    // Only update visibility for selected users
    if (selectedUserIds.length > 0 && changedKey) {
      await Promise.all(selectedUserIds.map(async (userId: string) => {
        const visibility = await prisma.userFieldVisibility.findUnique({
          where: {
            userId_fieldDefId: {
              userId,
              fieldDefId: req.params.id,
            },
          },
        });

        if (visibility) {
          const currentRules = visibility.visibilityRules as any;
          const updatedRules = {
            ...req.body.defaultVisibility,
            isVisible: currentRules.isVisible,
          };

          await prisma.userFieldVisibility.update({
            where: {
              userId_fieldDefId: {
                userId,
                fieldDefId: req.params.id,
              },
            },
            data: {
              visibilityRules: updatedRules,
            },
          });
        }
      }));
    }

    return res.json(field);
  } catch (error) {
    console.error('Error updating field definition:', error);
    return res.status(500).json({ 
      error: 'Failed to update field definition',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 