import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, View, Image } from 'react-native';
import { Container, Content, Card, CardItem, Body, Text, Spinner, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { translate } from '../../i18n';
import Loading from './Loading';
import Error from './Error';
import Header from './Header';
import Spacer from './Spacer';

const NoEvents = () => (
  <View>
    <Text style={{ fontSize: 35 }}>Ops...</Text>
    <Spacer size={20} />
    <Text style={{ fontSize: 22 }}>
      Parece que você não está inscrito em nenuhum evento ativo no Live QI Plus
    </Text>
    <Spacer size={20} />
    <Button primary onPress={() => Actions.home()}>
      <Icon name="home" />
      <Text style={{ fontSize: 18 }}>Voltar ao início</Text>
    </Button>
  </View>
);

const EventListing = ({
  error,
  loading,
  loader,
  locale,
  events,
  reFetch,
  eventSetter,
}) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  const keyExtractor = item => (item.id && item.id.toString()) || '';

  const onPress = (item) => {
    eventSetter(item.id);
    return Actions.event({ match: { params: { id: String(item.id) } } });
  };

  return (
    <Container>
      <Content padder>
        <Header
          title={translate('my_events_title', locale)}
          content={translate('my_events_subtitle', locale)}
        />
        {!events.length && <NoEvents />}
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
  eventSetter: PropTypes.func.isRequired,
};

EventListing.defaultProps = {
  loader: false,
  locale: null,
  error: null,
  reFetch: null,
};

export default EventListing;
