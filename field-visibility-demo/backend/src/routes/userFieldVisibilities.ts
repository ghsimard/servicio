import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all field visibilities (defaults to test user)
router.get('/', async (_req, res) => {
  try {
    // Get the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!user) {
      return res.status(404).json({ error: 'Test user not found' });
    }

    const visibilities = await prisma.userFieldVisibility.findMany({
      where: { userId: user.id },
      include: {
        fieldDefinition: true,
      },
    });

    // Transform the data to match the frontend's expected format
    const transformedVisibilities = visibilities.map(visibility => {
      const rules = visibility.visibilityRules as any;
      console.log('Field:', visibility.fieldDefinition.displayName);
      console.log('Rules:', rules);
      
      // A field can be toggled if:
      // 1. It's not required AND
      // 2. It's not admin controlled AND
      // 3. Helper can toggle is enabled
      const canToggle = !rules.required && !rules.adminControlled && rules.helperSwitchable;
      console.log('Can Toggle:', canToggle, 'helperSwitchable:', rules.helperSwitchable, 'adminControlled:', rules.adminControlled, 'required:', rules.required);
      
      return {
        id: visibility.id,
        fieldName: visibility.fieldDefinition.fieldName,
        displayName: visibility.fieldDefinition.displayName,
        isVisible: rules.isVisible,
        canToggle,
        category: visibility.fieldDefinition.entityType,
      };
    });

    return res.json(transformedVisibilities);
  } catch (error) {
    console.error('Error fetching user field visibilities:', error);
    return res.status(500).json({ error: 'Failed to fetch user field visibilities' });
  }
});

// Get all field visibilities for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const visibilities = await prisma.userFieldVisibility.findMany({
      where: { userId },
      include: {
        fieldDefinition: true,
      },
    });
    res.json(visibilities);
  } catch (error) {
    console.error('Error fetching field visibilities:', error);
    res.status(500).json({ error: 'Failed to fetch field visibilities' });
  }
});

// Update field visibility for a user
router.put('/:userId/:fieldId', async (req, res) => {
  try {
    const { userId, fieldId } = req.params;
    const { visibilityRules } = req.body;

    const visibility = await prisma.userFieldVisibility.upsert({
      where: {
        userId_fieldDefId: {
          userId,
          fieldDefId: fieldId,
        },
      },
      update: {
        visibilityRules,
      },
      create: {
        userId,
        fieldDefId: fieldId,
        visibilityRules,
      },
    });

    res.json(visibility);
  } catch (error) {
    console.error('Error updating field visibility:', error);
    res.status(500).json({ error: 'Failed to update field visibility' });
  }
});

export default router; 