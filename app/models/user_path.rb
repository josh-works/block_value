require 'digest'

class UserPath < ApplicationRecord

  def user_hash
    Digest::MD5.hexdigest rand().to_s
  end

end
