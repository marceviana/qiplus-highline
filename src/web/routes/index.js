import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';

// Templates
import TemplateNothing from '../components/TemplateNothing';
import TemplateSidebar from '../components/TemplateSidebar';

// Routes
import Home from '../components/Home';

import RecipesContainer from '../../containers/Recipes';
import RecipesComponent from '../components/Recipes';
import RecipeViewComponent from '../components/Recipe';

import EventsContainer from '../../containers/Events';
import EventsComponent from '../components/Events';

import EventContainer from '../../containers/Event';
import EventViewComponent from '../components/Event';

import ParticipantsContainer from '../../containers/Participants';
import ParticipantsViewComponent from '../components/Participants';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';

import Error from '../components/Error';


const Index = () => (
  <BrowserRouter basename="/live">
    <Switch>
      <Route
        exact
        path="/"
        render={props => (
          <TemplateSidebar>
            <Home {...props} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/sign-up"
        render={props => (
          <TemplateSidebar>
            <SignUpContainer {...props} Layout={SignUpComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/login"
        render={props => (
          <TemplateSidebar>
            <LoginContainer {...props} Layout={LoginComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/forgot-password"
        render={props => (
          <TemplateNothing>
            <ForgotPasswordContainer {...props} Layout={ForgotPasswordComponent} />
          </TemplateNothing>
        )}
      />
      <Route
        path="/update-profile"
        render={props => (
          <TemplateSidebar>
            <UpdateProfileContainer {...props} Layout={UpdateProfileComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/recipes"
        render={props => (
          <TemplateSidebar>
            <RecipesContainer {...props} Layout={RecipesComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/recipe/:id"
        render={props => (
          <TemplateSidebar>
            <RecipesContainer {...props} Layout={RecipeViewComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/events"
        render={props => (
          <TemplateSidebar>
            <EventsContainer {...props} Layout={EventsComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/event/:id/participants"
        render={props => (
          <TemplateSidebar>
            <ParticipantsContainer {...props} Layout={ParticipantsViewComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/event/:id/notes"
        render={props => (
          <TemplateSidebar>
            <EventContainer {...props} Layout={EventViewComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        path="/event/:id"
        render={props => (
          <TemplateSidebar>
            <EventContainer {...props} Layout={EventViewComponent} />
          </TemplateSidebar>
        )}
      />
      <Route
        render={props => (
          <TemplateSidebar>
            <Error {...props} title="404" content="Sorry, the route you requested does not exist" />
          </TemplateSidebar>
        )}
      />
    </Switch>
  </BrowserRouter>
);

export default Index;
