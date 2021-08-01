import React from 'react'
import { useSelector } from 'react-redux'

import Alert from 'react-bootstrap/Alert'

const AlertNotif = () => {
	const { alert, variant } = useSelector(state => state.alert)

	if (!alert) return null

	return(
		<Alert variant={variant} className='my-4'>
			{typeof(alert) === 'object'
				? Object.values(alert).map(msg => <div key={Object.keys(alert).find(key => alert[key] === msg)}>{msg}</div>)
				: alert}
		</Alert>
	)
}

export default AlertNotif