@Travis.reopen
  SigninView: Travis.View.extend
    templateName: 'auth/signin'

    signingIn: (->
      Travis.app.get('authState')
    ).property('Travis.app.authState')
