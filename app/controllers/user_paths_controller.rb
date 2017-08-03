class UserPathsController < ApplicationController

  def index
    render json: UserPath.all
  end

  def create
    params["_json"].each do |path|
      UserPath.create!(
                    lat: path["coords"][0],
                    long: path["coords"][1],
                    category: path["category"],
                    drawn_at: path["time"],
                    size_ratio: path["size_ratio"],
                    line_count: path["line_count"],
                    user_id: path["user_id"]
                    )
    end
    # render json: paths_params
  end

  def destroy
    last_line = UserPath.where(user_id: delete_params["user_id"]).maximum("line_count")
    UserPath.destroy_all(user_id: delete_params["user_id"], line_count: last_line)
  end


  private
    def delete_params
      params.require(:user_path).permit(:user_id, :line_count)
    end
    def paths_params
        params.permit ( [ { "_json" => ["coords", "category", "time"]} ] )
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
