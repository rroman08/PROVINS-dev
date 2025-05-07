import 'bootstrap/dist/css/bootstrap.min.css';

import buildClient from '../api/build-client'; 
import Header from '../components/header'; 

// This is the main entry point for the Next.js application
// It is responsible for rendering the application and passing props to the components
// The main component wraps all other components
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

// This function is used to fetch data before rendering the page
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });

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
    ...data,
  };
};

export default AppComponent;
