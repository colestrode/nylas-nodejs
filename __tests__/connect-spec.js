import Nylas from '../src/nylas';

describe('Connect', () => {

  const name = 'Connect Test';
  const password = 'connecting123';
  const scopes = 'email.modify,email.send,calendar,contacts';
  const exchangeEmail = 'connect_test@outlook.com';
  const gmailEmail = 'connect_test@gmail.com';
  const imapEmail = 'connect_test@yahoo.com';
  const o365Email = 'connect_test@nylatest.onmicrosoft.com';
  const CLIENT_ID = 'abc';
  const authorizeOptions = ((email, provider, settings) => {
  	return {
	  	name: name,
	  	email_address: email,
	  	provider: provider,
	  	settings: settings,
	  	scopes: scopes,
  	}
  });
  const authorizeJSON = {
  	code: 'bOjq4Wt9ZAlCy0CSbVeDGDQ5PquytC',
  }

  describe('authorize without clientId', () => {
  	beforeEach(() => {
  	  Nylas.config({});  		
  	});

    test('Should throw an error when the clientId is not passed in to Nylas.config()', () => {
      expect.assertions(1);
      expect(() => {
	      Nylas.connect.authorize(authorizeOptions(exchangeEmail, 'exchange', { username: exchangeEmail, password: password })).then(resp => done())
      }).toThrow()
    });
  });

  describe('authorize with clientId', () => {
  	beforeEach(() => {
  	  Nylas.config({
  	    clientId: CLIENT_ID,
  	    clientSecret: 'xyz',
  	  });  		
  	});

    test('Should do a POST request to /connect/authorize', done => {
      expect.assertions(2);
      Nylas.connect.connection.request = jest.fn(() =>
        Promise.resolve(authorizeJSON)
      );
      Nylas.connect.authorize(authorizeOptions(exchangeEmail, 'exchange', { username: exchangeEmail, password: password })).then(resp => {
        expect(resp).toEqual(authorizeJSON);
        expect(Nylas.connect.connection.request).toHaveBeenCalledWith({
          method: 'POST',
          path: '/connect/authorize',
          body: {
          	client_id: CLIENT_ID,
          	name: name,
          	email_address: exchangeEmail,
          	provider: 'exchange',
          	settings: { username: exchangeEmail, password: password },
          	scopes: scopes,
          }
        });
        done();
      })
    });
  });
});