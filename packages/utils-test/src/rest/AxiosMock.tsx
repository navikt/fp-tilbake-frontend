import { FunctionComponent, useEffect } from 'react';
import MockAdapter from 'axios-mock-adapter';
import { RequestApi } from '@fpsak-frontend/rest-api';

interface Props {
  requestApi: RequestApi;
  children: any;
  data: {
    key: string;
    data?: any,
    dataFn?: (config: any) => any;
    noRelLink?: boolean,
  }[];
  setApiMock?: (mockAdapter: MockAdapter) => void;
}

const AxiosMock: FunctionComponent<Props> = ({
  children,
  data,
  requestApi,
  setApiMock = () => undefined,
}) => {
  const apiMock = new MockAdapter(requestApi.getAxios());
  setApiMock(apiMock);

  requestApi.setLinks(data.filter((d) => !d.noRelLink).map((d) => ({
    href: d.key,
    rel: requestApi.endpointConfigList.find((c) => c.name === d.key).rel,
    type: 'GET',
  })));

  data.forEach((d) => {
    if (requestApi.getRestType(d.key) === 'GET') {
      if (d.data) {
        apiMock.onGet(requestApi.getUrl(d.key)).reply(200, d.data);
      }
      if (d.dataFn) {
        apiMock.onGet(requestApi.getUrl(d.key)).reply(d.dataFn);
      }
    } else if (requestApi.getRestType(d.key) === 'GET_ASYNC') {
      apiMock.onGet(requestApi.getUrl(d.key)).replyOnce(200, d.data);
    } else if (requestApi.getRestType(d.key) === 'POST_ASYNC') {
      apiMock.onPost(requestApi.getUrl(d.key)).replyOnce(200, d.data);
    } else {
      apiMock.onPost(requestApi.getUrl(d.key)).reply(200, d.data);
    }
  });

  useEffect(() => () => {
    apiMock.reset();
    requestApi.setLinks([]);
    requestApi.resetCache();
  }, []);
  return children;
};

export default AxiosMock;
