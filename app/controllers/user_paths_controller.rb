class UserPathsController < ApplicationController

  def index
    render json: UserPath.all
  end

  def create
    # data = UserPath.new(paths_params)
    paths_params.each do |path|
      # this is pulling each item in single array, making four objects
      UserPath.create!(
                    lat: paths_params[0],
                    long: paths_params[1],
                    category: paths_params[2],
                    drawn_at: paths_params[3]
                    )
    end
    render json: UserPath.all
  end


  private

    def paths_params
      params.require(:data)
    end
end


# "lat"
# "long"
# "category"
# "drawn_at"
