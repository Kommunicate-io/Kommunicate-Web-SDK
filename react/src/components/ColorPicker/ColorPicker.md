Color Picker

```jsx noeditor
initialState = { color: "#5553B7" }
;<div>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-start"}}>
        <ColorPicker className="sample-color-picker" heading="Choose a Color" disableAlpha={true} color={state.color} onChange={(changedColor) => {
            setState({ color: changedColor.hex });
        }} />
        <div style={{ backgroundColor: state.color, width: "172px", height: "38px", borderRadius: "6px", marginLeft: "15px" }}></div>
    </div>
</div>
```

```jsx static
import ColorPicker from '../components/ColorPicker/ColorPicker';

state = {
    color: ""
}

handleColorChange = (changedColor) => {
    this.setState({ color: changedColor.hex });
}

<ColorPicker 
    className="sample-color-picker" 
    heading="Choose a Color" 
    disableAlpha={true} 
    color={this.state.color} 
    onChange={this.handleColorChange} 
/>
```