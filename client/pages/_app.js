import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client'; 
import Header from '../components/header'; 

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // Build an axios client with the context
  const client = buildClient(appContext.ctx);
  // Make a request to the current user route
  const { data } = await client.get('/api/users/currentuser');
  
  // Get the initial props of the component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx, 
      client, 
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
