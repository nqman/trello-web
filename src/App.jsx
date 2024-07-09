import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useColorScheme
} from '@mui/material'
import Typography from '@mui/material/Typography'

function SelectMode() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (e) => {
    setMode(e.target.value)
  }
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-mode">Mode</InputLabel>
      <Select
        labelId="select-mode"
        id="demo-select-small"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
        <MenuItem value="system">System</MenuItem>
      </Select>
    </FormControl>
  )
}

function ModeToggle() {
  // return (
  //   <Button
  //     onClick={() => {
  //       setMode(mode === 'light' ? 'dark' : 'light')
  //     }}
  //   >
  //     {mode === 'light' ? 'Turn dark' : 'Turn light'}
  //   </Button>
  // )
}
function App() {
  return (
    <div>
      <div>Hello world</div>
      <SelectMode />

      <ModeToggle />
      <Typography variant="body2" color="text.secondary">
        Hello
      </Typography>
      <Typography variant="body2" color="text.primary">
        Hello
      </Typography>
    </div>
  )
}

export default App
