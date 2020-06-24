export class RegularExpression {
  /**
   * Passwords will contain at least 1 upper case letter
   * Passwords will contain at least 1 lower case letter
   * Passwords will contain at least 1 number or special character
   * There is no length validation (min, max) in this regex!
   */
  public static readonly PASSWORD: RegExp = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
}
