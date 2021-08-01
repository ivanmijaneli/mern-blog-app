import React from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const DeleteWindow = ({ show, handleShow, handleDelete }) => {
	return (
		<Modal show={show} onHide={handleShow} centered>
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleShow}>
					Close
				</Button>
				<Button variant="danger" onClick={handleDelete}>
					Yes
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default DeleteWindow