class UserPathsController < ApplicationController

  def index
    render json: UserPath.all
  end

  def create
    # data = UserPath.new(paths_params)
    params["_json"].each do |path|
      # this is pulling each item in single array, making four objects
      UserPath.create!(
                    lat: path["coords"][0],
                    long: path["coords"][1],
                    category: path["category"],
                    drawn_at: path["time"]
                    )
    end
    render json: paths_params
  end


  private

    def paths_params
        params.permit
        (
          [
            { "_json" => ["coords", "category", "time"]}
          ]
        )
    end
end


# "lat"
# "long"
# "category"
# "drawn_at"

 # Sample params objc passted from FE
# Parameters:
#   {"_json"=>
#     [
#       {"coords"=>[39.74875182107212, -105.21966037699889], "category"=>"setback", "time"=>1501112850844},
#       {"coords"=>[39.74826100814211, -105.21963355490874], "category"=>"setback", "time"=>1501112851125}
#     ]
#   }
