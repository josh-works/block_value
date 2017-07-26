class UserPathsController < ApplicationController

  def create
    # data = UserPath.new(paths_params)
    binding.pry
    render json: params
  end


  private

    def paths_params
      params.require(:user_path).permit(:data)
    end
end
