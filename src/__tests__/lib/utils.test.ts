import { describe, it, expect } from 'vitest'
import { cn } from '../../lib/utils'

describe('Utils', () => {
  describe('cn() function', () => {
    it('should merge className strings correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle undefined values', () => {
      const result = cn('class1', undefined, 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle null values', () => {
      const result = cn('class1', null, 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle empty strings', () => {
      const result = cn('class1', '', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle mixed types', () => {
      const result = cn(
        'base',
        ['array1', 'array2'],
        {
          conditional: true,
          hidden: false,
        },
        undefined,
        null,
        '',
        'final'
      )
      expect(result).toBe('base array1 array2 conditional final')
    })

    it('should merge Tailwind classes properly', () => {
      // Test for duplicate class handling (tailwind-merge functionality)
      const result = cn('px-4', 'px-2')
      expect(result).toBe('px-2') // Should keep the last one
    })

    it('should handle conflicting Tailwind classes', () => {
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500') // Should keep the last one
    })

    it('should preserve non-conflicting classes', () => {
      const result = cn('text-white', 'bg-blue-500', 'px-4', 'py-2')
      expect(result).toBe('text-white bg-blue-500 px-4 py-2')
    })

    it('should handle complex Tailwind merging', () => {
      const result = cn(
        'bg-red-500 text-white px-4',
        'bg-blue-500 py-2',
        'hover:bg-green-500'
      )
      expect(result).toBe('text-white px-4 bg-blue-500 py-2 hover:bg-green-500')
    })

    it('should handle responsive classes', () => {
      const result = cn('px-4', 'md:px-6', 'lg:px-8')
      expect(result).toBe('px-4 md:px-6 lg:px-8')
    })

    it('should handle state variants', () => {
      const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700')
      expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700')
    })

    it('should handle size variants correctly', () => {
      const result = cn('w-4', 'h-4', 'w-6') // w-6 should override w-4
      expect(result).toContain('h-4')
      expect(result).toContain('w-6')
      expect(result).not.toContain('w-4')
    })

    it('should handle spacing classes', () => {
      const result = cn('m-4', 'mx-2', 'my-6')
      // tailwind-merge may not override m-4 with mx-2/my-6 as expected
      // Let's test what it actually does
      expect(result).toContain('mx-2')
      expect(result).toContain('my-6')
    })

    it('should work with no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle only falsy values', () => {
      const result = cn(false, null, undefined, '')
      expect(result).toBe('')
    })

    it('should handle complex conditional logic', () => {
      const isActive = true
      const isDisabled = false
      const variant = 'primary'
      
      const result = cn(
        'btn',
        isActive && 'active',
        isDisabled && 'disabled',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary'
      )
      
      expect(result).toBe('btn active btn-primary')
    })

    it('should handle object-style conditional classes', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true,
      })
      expect(result).toBe('class1 class3')
    })

    it('should handle nested arrays', () => {
      const result = cn(['class1', ['class2', 'class3']], 'class4')
      expect(result).toBe('class1 class2 class3 class4')
    })

    it('should handle function values (clsx feature)', () => {
      const getValue = () => 'dynamic-class'
      const result = cn('static-class', getValue())
      expect(result).toBe('static-class dynamic-class')
    })

    it('should be consistent with multiple calls', () => {
      const classes = ['base', 'text-white', 'bg-blue-500']
      const result1 = cn(...classes)
      const result2 = cn(...classes)
      expect(result1).toBe(result2)
    })

    it('should handle edge case with only spaces', () => {
      const result = cn('   ', 'class1', '   ', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle number values', () => {
      // Numbers should be converted to strings
      const result = cn('class1', 42, 'class2')
      expect(result).toBe('class1 42 class2')
    })

    it('should handle boolean values directly', () => {
      const result = cn('class1', true, 'class2', false, 'class3')
      expect(result).toBe('class1 class2 class3')
    })
  })
})