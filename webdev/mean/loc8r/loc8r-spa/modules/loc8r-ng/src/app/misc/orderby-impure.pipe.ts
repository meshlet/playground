/**
 * A pipe that sorts the input array using the user-specified
 * compare function.
 *
 * @note This is an impure pipe meaning that its transform method
 * will be invoked each time change detection is run. The pipe
 * compares previous and current version of the array and sorts
 * the array if there were any differences between the two. If
 * specific usecase guarantes that array elements will never change
 * (i.e. no additionas, removals or updates) consider using the
 * pure version of this pipe (orderby.pipe.ts).
 */
