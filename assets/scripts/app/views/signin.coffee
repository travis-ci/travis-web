@Travis.reopen
  SigninView: Travis.View.extend
    templateName: 'auth/signin'

    signingIn: (->
      Travis.get('authState') == 'signing-in'
    ).property('Travis.authState')
