require 'rails_helper'

describe UserPath, type: :request do
  it "can write single location to DB" do
    data = [39.74822801218945, -105.21933314749907, "setback", 1501046327308]

    expect(UserPath.count).to eq(0)

    post '/paths', params: {data: data}
    return_data = JSON.parse(response.body)
    binding.pry

    expect(return_data).to eq(data)
    expect(UserPath.count).to eq(1)

  end


end
