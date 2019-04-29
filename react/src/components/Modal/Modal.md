Modal

```jsx noeditor
import Button from '../../components/Buttons/Button'
import Modal from '../../components/Modal/Modal'
initialState = { modalIsOpen: false }
;<div>
    <Button onClick={() => {
        setState({ modalIsOpen: !state.modalIsOpen })
    }}>Toggle Modal</Button>

    <Modal isOpen={state.modalIsOpen} heading="Modal Heading" onRequestClose={() => {
        setState({ modalIsOpen: false })
    }} width="500px">
        <div>Modal Content goes here</div>
    </Modal>
</div>
```
```jsx static
import Modal from '../../components/Modal/Modal';

state={
    modalIsOpen: false
}

toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen })
}

<Modal 
    isOpen={this.state.modalIsOpen} 
    heading="Modal Heading" 
    onRequestClose={this.toggleModal} 
    width="500px" >

    <div>Modal Content goes here</div>

</Modal>
```