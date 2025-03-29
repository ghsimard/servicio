import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fieldDefinitionsRouter from './routes/fieldDefinitions';
import userFieldVisibilitiesRouter from './routes/userFieldVisibilities';
import usersRouter from './routes/users';

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/field-definitions', fieldDefinitionsRouter);
app.use('/api/user/field-visibilities', userFieldVisibilitiesRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 