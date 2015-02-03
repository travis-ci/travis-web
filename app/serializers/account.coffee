ApplicationSerializer = Travis.ApplicationSerializer

Serializer = ApplicationSerializer.extend
  primaryKey: 'login'

Travis.AccountSerializer = Serializer
