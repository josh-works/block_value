require 'rails_helper'

describe UserPath, type: :request do
  it "can write single location to DB" do
    data = [39.74822801218945, -105.21933314749907, "setback", 1501046327308]

    expect(UserPath.count).to eq(0)

    post '/paths', params: {data: data}
    return_data = JSON.parse(response.body)


    expect(return_data).to eq(data)
    expect(UserPath.count).to eq(1)
  end


end

# This is what's getting pushed to server:
# Object {coords: Array(2), category: "setback", time: 1501107834823}
# category: "setback"
# coords: Array(2)
# 0: 39.7478815537324
# 1: -105.2193921560974
# time: 1501107834823
