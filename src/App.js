import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'

import { Provider } from 'react-redux'
import store from './store'

import { renderRoutes } from 'react-router-config'
import routes from './routes'

import { Data } from './application/Singers/data'
import { HashRouter as Router } from 'react-router-dom'


function App() {
  return (
    <Provider store={ store }>
      <Router>
        <GlobalStyle />
        <IconStyle />
        <Data>
        { renderRoutes(routes) }

        </Data>
      </Router>
    </Provider>
    
  );
}

export default App;
