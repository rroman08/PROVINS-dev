import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';  

const AppComponent = ({ Component, pageProps }) => {
  return <div>
    <h1>Header!</h1>
    <Component {...pageProps} />
    </div>;
};

AppComponent.getInitialProps = async (appContext) => {
  // build an axios client with the context
  const client = buildClient(appContext.ctx);
  // make a request to the current user route
  const { data } = await client.get("/api/users/currentuser");
  
  // get the initial props of the component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
