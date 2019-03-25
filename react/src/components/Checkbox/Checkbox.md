#### Checkbox
```jsx noeditor
initialState = { isChecked: false }
;<Checkbox idCheckbox="abc" label={'Check me out!'} checked={state.isChecked} handleOnChange = {() => {
    setState({ isChecked: !state.isChecked })
}} />
```
```jsx static
<Checkbox 
    idCheckbox="checkbox-id" 
    label={'Check me out!'} 
    checked={this.state.isChecked} 
    handleOnChange = {() => {
        this.setState({ isChecked: !this.state.isChecked })
    }} 
/>
```
- - -
#### Checkbox Disabled
```jsx noeditor
initialState = { isChecked: false }
;<Checkbox idCheckbox="abcd" disabled={true} label="You can't check me out 'cause I'm disabled :(" checked={state.isChecked} handleOnChange = {() => {
    setState({ isChecked: !state.isChecked })
}} />
```
```jsx static
<Checkbox 
    idCheckbox="checkbox-id" 
    disabled={true} 
    label="You can't check me out 'cause I'm disabled :(" checked={this.state.isChecked} 
    handleOnChange = {() => {
        this.setState({ isChecked: !this.state.isChecked })
    }}
/>
```