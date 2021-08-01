describe('Blog app', function() {
	beforeEach(function() {
		cy.request('POST', 'http://localhost:4000/api/testing/reset')
		cy.visit('http://localhost:3000')
	})

	describe('register, verify, login, view, post, like, comment, delete, logout, forgot, reset', function() {
		it('user can register', function() {
			cy.createInbox().then(function({ id, emailAddress }) {
				cy.contains('Register').click()
				cy.get('#first-name').type('zuko')
				cy.get('#last-name').type('firelord')
				cy.get('#email').type(emailAddress)
				cy.get('#username').type('zukohere')
				cy.get('#password').type('mei123')
				cy.get('#confirm-password').type('mei123')
				cy.get('#register-form').submit()
				cy.contains('registration successful')

				// cy.get('#username').type('zukohere')
				// cy.get('#password').type('mei123')
				// cy.get('#login-form').submit()
				// cy.contains('please verify your account')

				// cy.visit('http://localhost:3000/verify-email')
				// cy.contains('Oops, verification failed.')

				// cy.waitForLatestEmail(id).then(function(email) {
					// const verificationLink = /(3D'>)(.*)(<\/a)/.exec(email.body)[2]
					// cy.visit(verificationLink)
					// cy.contains('Your email has been verified!')
					// cy.contains('Back to Login').click()

					cy.get('#username').type('zukohere')
					cy.get('#password').type('mei1234')
					cy.get('#login-form').submit()
					cy.contains('invalid username or password')

					cy.get('#username').clear().type('zukohere')
					cy.get('#password').clear().type('mei123')
					cy.get('#login-form').submit()

					cy.contains('Hola zukohere!')

					cy.contains('Add Blog').click()
					cy.get('#title').type('Fall of Omashu')
					cy.get('#author').type('Bumi')
					cy.get('#url').type('https://avatar.fandom.com/wiki/Surrender_of_Omashu')
					cy.get('#add-blog-form').submit()
					cy.contains('blog added')
					cy.contains('Fall of Omashu').click()

					cy.contains(0)
					cy.contains('like').click()
					cy.contains(1)
					cy.contains('unlike').click()
					cy.contains(0)
					cy.get('#comment').type('I hope Mei showed you mercy.')
					cy.get('#comment-form').submit()
					cy.contains('comment added')
					cy.contains('I hope Mei showed you mercy.')
					cy.contains('Users').click()

					cy.contains(1)
					cy.get('#username-link').contains('zukohere').click()
					cy.contains('Fall of Omashu').click()

					cy.contains('delete').click()
					cy.contains('Yes').click()
					cy.contains('blog deleted')
					cy.get('Fall of Omashu').should('not.exist')
					cy.contains('Logout').click()

					cy.contains('Forgot password?').click()
					cy.get('#email').type(emailAddress)
					cy.get('#forgot-password-form').submit()
					cy.contains('check email for reset instructions')

					cy.visit('http://localhost:3000/reset-password')
					cy.contains('Oops, token invalid or expired! Try again or back to login?')

					// cy.deleteEmail(email.id).then(function() {
					// 	cy.waitForLatestEmail(id, true).then(function(email) {
					// 		const resetPasswordLink = /(3D'>)(.*)(<\/a)/.exec(email.body)[2]
					// 		cy.visit(resetPasswordLink)
					// 		cy.get('#password').type('forgivemeaang')
					// 		cy.get('#confirm-password').type('forgivemeaang')
					// 		cy.get('#reset-password-form').submit()
					// 		cy.contains('password reset successful')
					// 		cy.contains('Login').click()

					// 		cy.get('#username').type('zukohere')
					// 		cy.get('#password').type('forgivemeaang')
					// 		cy.get('#login-form').submit()

					// 		cy.contains('Hola zukohere!')
					// 		cy.contains('Logout').click()
					// 	})
					// })
				// })
			})
		})
	})
})