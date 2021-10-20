const Modal = ( {isShow, setFoo, children} ) => {
    if ( isShow ) {
        return (
            <div className="modal-container" style={{"display": "flex"}}>
                <div id="modal-view">
                    {children}
                    <button onClick={() => { setFoo(false); }} className="btn btn-danger" type="button" id="close-add-modal">Close</button>
                </div>
            </div>
        )
    }
    return null
}

export default Modal;


