import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Container, Content, Card, CardItem, Body, Text, Spinner, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { translate } from '../../i18n';
import Loading from './Loading';
import Error from './Error';
import Header from './Header';
import Spacer from './Spacer';

const EventListing = ({
  error,
  loading,
  loader,
  locale,
  events,
  reFetch,
  eventLoader,
  eventSetter,
}) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  const keyExtractor = item => (item.id && item.id.toString()) || '';

  const onPress = (item) => {
    eventLoader();
    eventSetter( item.id );
    return Actions.event({ match: { params: { id: String(item.id) } } });
  };

  return (
    <Container>
      <Content padder>
        <Header
          title={translate('my_events_title', locale)}
          content={translate('my_events_subtitle', locale)}
        />
        {loader && <Spinner color="blue" />}
        <FlatList
          numColumns={1}
          data={events}
          renderItem={({ item }) => (
            <Card transparent style={{ paddingHorizontal: 6 }}>
              <CardItem cardBody>
                <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: item.banner }}
                    style={{
                      height: 200,
                      width: null,
                      flex: 1,
                      borderRadius: 5,
                    }}
                  />
                </TouchableOpacity>
              </CardItem>
              <CardItem cardBody>
                <Body>
                  <Spacer size={10} />
                  <Text style={{ fontWeight: '800' }}>{item.title}</Text>
                  <Spacer size={15} />
                  <Button
                    block
                    small
                    onPress={() => onPress(item)}
                  >
                    <Text>{translate('view_event', locale)}</Text>
                  </Button>
                  <Spacer size={5} />
                </Body>
              </CardItem>
            </Card>
          )}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={reFetch}
            />
          }
        />

        <Spacer size={20} />
      </Content>
    </Container>
  );
};

EventListing.propTypes = {
  locale: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  loader: PropTypes.bool,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reFetch: PropTypes.func,
  eventLoader: PropTypes.func,
  eventSetter: PropTypes.func.isRequired,
};

EventListing.defaultProps = {
  loader: false,
  locale: null,
  error: null,
  reFetch: null,
  eventLoader: null,
};

export default EventListing;
