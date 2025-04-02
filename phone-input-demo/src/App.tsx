import { PhoneInput } from './components/PhoneInput'
import { CssBaseline, Container, Box } from '@mui/material'

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <PhoneInput />
        </Box>
      </Container>
    </>
  )
}

export default App
