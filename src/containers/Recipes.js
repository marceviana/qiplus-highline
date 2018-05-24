import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getRecipes, getMeals, setError } from '../actions/recipes';

class RecipeListing extends Component {
  static propTypes = {
    locale: PropTypes.string,
    Layout: PropTypes.func.isRequired,
    recipes: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
      recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    getRecipes: PropTypes.func.isRequired,
    getMeals: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    locale: null,
    match: null,
  }

  componentDidMount = () => this.fetchRecipes();

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchRecipes = () => this.props.getRecipes()
    .then(() => this.props.getMeals())
    .catch((err) => {
      console.log(`Error: ${err}`);
      return this.props.setError(err);
    })

  render = () => {
    const {
      Layout, recipes, locale, match,
    } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;

    return (
      <Layout
        recipeId={id}
        locale={locale}
        error={recipes.error}
        loading={recipes.loading}
        recipes={recipes.recipes}
        reFetch={() => this.fetchRecipes()}
      />
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale || null,
  recipes: state.recipes || {},
});

const mapDispatchToProps = {
  getRecipes,
  getMeals,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeListing);
