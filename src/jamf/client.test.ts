import { Response } from 'node-fetch';
import { JamfClient } from './client';
import { createMockComputerDetail } from '../../test/mocks';
import { ComputerDetail } from './types';

function getMockFetchComputerByIdResponse(
  computerDetail: ComputerDetail,
): Response {
  const response = new Response('Test', {
    status: 200,
  });

  response.json = jest.fn().mockResolvedValueOnce({
    computer: computerDetail,
  });

  return response;
}

function getMockRetryableResponse(): Response {
  const response = new Response('Test', {
    status: 500,
    statusText: 'Internal Server Error',
  });

  response.json = jest.fn().mockRejectedValueOnce(new Error('should not call'));
  return response;
}

function getMockNonRetryableResponse(): Response {
  const response = new Response('Test', {
    status: 404,
    statusText: 'Not Found',
  });

  response.json = jest.fn().mockRejectedValueOnce(new Error('should not call'));
  return response;
}

describe('#JamfClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should retry request when retryable status code received', async () => {
    const onApiRequestError = jest.fn();
    const mockComputerDetail = createMockComputerDetail();

    const request = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(getMockRetryableResponse()))
      .mockResolvedValueOnce(
        Promise.resolve(getMockFetchComputerByIdResponse(mockComputerDetail)),
      );

    const client = new JamfClient({
      host: 'https://jupiteronedev.jamfcloud.com',
      username: 'test',
      password: 'test',
      onApiRequestError,
      request,
    });

    const result = await client.fetchComputerById(1);

    expect(result).toEqual(mockComputerDetail);
    expect(request).toHaveBeenCalledTimes(2);

    expect(onApiRequestError).toHaveBeenCalledTimes(1);
    expect(onApiRequestError).toHaveBeenCalledWith({
      err: new Error(
        'Provider API failed at https://jupiteronedev.jamfcloud.com/JSSResource/computers/id/1: 500 Internal Server Error',
      ),
      url: 'https://jupiteronedev.jamfcloud.com/JSSResource/computers/id/1',
      code: 'PROVIDER_API_ERROR',
      attemptNum: 0,
      attemptsRemaining: 2,
    });
  });

  test('should not retry when non-retryable status code received', async () => {
    const onApiRequestError = jest.fn();

    const request = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(getMockNonRetryableResponse()))
      .mockRejectedValueOnce(new Error('should not retry non-retryable'));

    const client = new JamfClient({
      host: 'https://jupiteronedev.jamfcloud.com',
      username: 'test',
      password: 'test',
      onApiRequestError,
      request,
    });

    await expect(client.fetchComputerById(1)).rejects.toThrowError(
      'Provider API failed at https://jupiteronedev.jamfcloud.com/JSSResource/computers/id/1: 404 Received non-retryable status code in API response',
    );

    expect(request).toHaveBeenCalledTimes(1);
    expect(onApiRequestError).toHaveBeenCalledTimes(0);
  });
});
