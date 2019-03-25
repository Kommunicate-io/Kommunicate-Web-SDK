```jsx noeditor
initialState={ selectedOption: 2 }
;<MultiToggleSwitch
    options={[
        {
            displayName: 'Windows',
            value: 2
        },
        {
            displayName: 'Mac',
            value: 0
        },
        {
            displayName: 'Linux',
            value: 1
        },
    ]}
    selectedOption={state.selectedOption}
    onSelectOption={(value) => {
        setState({ selectedOption: value })
    }}
    label="Which OS do you think is the best?"
    className="os-choice"
/>
```
```jsx static
<MultiToggleSwitch
    options={[
        {
            displayName: 'Windows',
            value: 2
        },
        {
            displayName: 'Mac',
            value: 0
        },
        {
            displayName: 'Linux',
            value: 1
        },
    ]}
    selectedOption={this.state.selectedOption}
    onSelectOption={(value) => {
        this.setState({ selectedOption: value })
    }}
    label="Which OS do you think is the best?"
    className="os-choice"
/>
```