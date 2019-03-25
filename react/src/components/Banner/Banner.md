Basic baner:

```jsx
<Banner appearance="info" heading="This is an Info Banner" />
<br />
<Banner appearance="error" heading="This is an Error Banner" />
<br />
<Banner appearance="success" heading="This is a Success Banner" />
<br />
<Banner appearance="warning" heading="This is a Warning Banner" />
```

Any raw HTML or a react component can be passed inside the Banner component like showcased below.
```jsx noeditor
import Button from '../../components/Buttons/Button'
;<Banner appearance="success" heading="This is a Warning Banner with a <p> tag as its children"> 
    <p>This is just a normal paragraph</p>
</Banner>
```
```jsx static
import Button from '../../components/Buttons/Button'
<Banner appearance="success" heading="This is a Warning Banner with a <p> tag as its children"> 
    <p>This is just a normal paragraph</p>
</Banner>
```
```jsx noeditor
import Button from '../../components/Buttons/Button'
;<Banner appearance="warning" heading="This is a Warning Banner with a react component as its children"> 
    <Button>Button</Button>
</Banner>
```
```jsx static
import Button from '../../components/Buttons/Button'
<Banner appearance="warning" heading="This is a Warning Banner with a react component as its children"> 
    <Button>Button</Button>
</Banner>
```