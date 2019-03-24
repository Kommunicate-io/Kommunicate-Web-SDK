Slider Toggle


```jsx noeditor
initialState = { checked: true }
;<SliderToggle checked={state.checked} handleOnChange={() => {
    setState({ checked: !state.checked })
}} />
```
```jsx static
<SliderToggle 
    checked={this.state.checked} 
    handleOnChange={() => {
        this.setState({ checked: !this.state.checked })
    }}
/>
```

Inline toggle switch
```jsx noeditor
initialState = { checked: true }
;<div style={{display: 'flex'}}>
    <div style={{marginRight: '10px'}}>This is a toggle switch</div>
    <SliderToggle checked={state.checked} handleOnChange={() => {
        setState({ checked: !state.checked })
    }} />
</div>
```
```jsx static
<div style={{display: 'flex'}}>
    <div style={{marginRight: '10px'}}>This is a toggle switch</div>
    <SliderToggle 
        checked={this.state.checked} 
        handleOnChange={() => {
            this.setState({ checked: !this.state.checked })
        }} 
    />
</div>
```