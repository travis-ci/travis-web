@Travis.reopen
  SigninView: Travis.View.extend
    templateName: 'auth/signin'

    signingIn: (->
      Travis.app.get('authState') == 'signing-in'
    ).property('Travis.app.authState')
