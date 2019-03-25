#### Radio Buttons
```jsx noeditor
initialState = { checked: false }
;<div style={{display: 'flex'}}>
    <RadioButton cssClass="radio-button-class" handleOnChange={() => setState({ checked: !state.checked })} checked={state.checked} label="This is a normal Radio Button" />
    <RadioButton cssClass="radio-button-class" handleOnChange={() => setState({ checked: !state.checked })} checked={!state.checked} label="This is a normal Radio Button" />
</div>
```
```jsx static
<div style={{display: 'flex'}}>
    <RadioButton 
        cssClass="radio-button-class" 
        handleOnChange={() => this.setState({ checked: !this.state.checked })} 
        checked={this.state.checked} 
        label="This is a normal Radio Button" 
    />
    <RadioButton 
        cssClass="radio-button-class" 
        handleOnChange={() => this.setState({ checked: !this.state.checked })} 
        checked={!this.state.checked} 
        label="This is a normal Radio Button" 
    />
</div>
```
- - - 
#### Radio Buttons Disabled
```jsx noeditor
initialState = { checked: false }
;<div style={{display: 'flex'}}>
    <RadioButton disabled={true}
disabled={true}  cssClass="radio-button-class" handleOnChange={() => setState({ checked: !state.checked })} checked={state.checked} label="This is a normal Radio Button" />
    <RadioButton disabled={true}
disabled={true}  cssClass="radio-button-class" handleOnChange={() => setState({ checked: !state.checked })} checked={!state.checked} label="This is a normal Radio Button" />
</div>
```
```jsx static
<div style={{display: 'flex'}}>
    <RadioButton
        disabled={true} 
        cssClass="radio-button-class"
        handleOnChange={() => this.setState({ checked: !this.state.checked })} 
        checked={this.state.checked} 
        label="This is a normal Radio Button" 
    />
    <RadioButton
        disabled={true}
        cssClass="radio-button-class"
        handleOnChange={() => this.setState({ checked: !this.state.checked })}
        checked={!this.state.checked}
        label="This is a normal Radio Button"
    />
</div>
```